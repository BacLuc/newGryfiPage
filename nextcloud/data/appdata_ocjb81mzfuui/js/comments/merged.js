/*
 * Copyright (c) 2016 Vincent Petry <pvince81@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function() {
	if (!OCA.Comments) {
		/**
		 * @namespace
		 */
		OCA.Comments = {};
	}

})();



/*
 * Copyright (c) 2016
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function(OC, OCA) {

	_.extend(OC.Files.Client, {
		PROPERTY_FILEID:	'{' + OC.Files.Client.NS_OWNCLOUD + '}id',
		PROPERTY_MESSAGE: 	'{' + OC.Files.Client.NS_OWNCLOUD + '}message',
		PROPERTY_ACTORTYPE:	'{' + OC.Files.Client.NS_OWNCLOUD + '}actorType',
		PROPERTY_ACTORID:	'{' + OC.Files.Client.NS_OWNCLOUD + '}actorId',
		PROPERTY_ISUNREAD:	'{' + OC.Files.Client.NS_OWNCLOUD + '}isUnread',
		PROPERTY_OBJECTID:	'{' + OC.Files.Client.NS_OWNCLOUD + '}objectId',
		PROPERTY_OBJECTTYPE:	'{' + OC.Files.Client.NS_OWNCLOUD + '}objectType',
		PROPERTY_ACTORDISPLAYNAME:	'{' + OC.Files.Client.NS_OWNCLOUD + '}actorDisplayName',
		PROPERTY_CREATIONDATETIME:	'{' + OC.Files.Client.NS_OWNCLOUD + '}creationDateTime',
		PROPERTY_MENTIONS: '{' + OC.Files.Client.NS_OWNCLOUD + '}mentions'
	});

	/**
	 * @class OCA.Comments.CommentModel
	 * @classdesc
	 *
	 * Comment
	 *
	 */
	var CommentModel = OC.Backbone.Model.extend(
		/** @lends OCA.Comments.CommentModel.prototype */ {
		sync: OC.Backbone.davSync,

		defaults: {
			actorType: 'users',
			objectType: 'files'
		},

		davProperties: {
			'id':	OC.Files.Client.PROPERTY_FILEID,
			'message':	OC.Files.Client.PROPERTY_MESSAGE,
			'actorType':	OC.Files.Client.PROPERTY_ACTORTYPE,
			'actorId':	OC.Files.Client.PROPERTY_ACTORID,
			'actorDisplayName':	OC.Files.Client.PROPERTY_ACTORDISPLAYNAME,
			'creationDateTime':	OC.Files.Client.PROPERTY_CREATIONDATETIME,
			'objectType':	OC.Files.Client.PROPERTY_OBJECTTYPE,
			'objectId':	OC.Files.Client.PROPERTY_OBJECTID,
			'isUnread':	OC.Files.Client.PROPERTY_ISUNREAD,
			'mentions': OC.Files.Client.PROPERTY_MENTIONS
		},

		parse: function(data) {
			return {
				id: data.id,
				message: data.message,
				actorType: data.actorType,
				actorId: data.actorId,
				actorDisplayName: data.actorDisplayName,
				creationDateTime: data.creationDateTime,
				objectType: data.objectType,
				objectId: data.objectId,
				isUnread: (data.isUnread === 'true'),
				mentions: this._parseMentions(data.mentions)
			};
		},

		_parseMentions: function(mentions) {
			if(_.isUndefined(mentions)) {
				return {};
			}
			var result = {};
			for(var i in mentions) {
				var mention = mentions[i];
				if(_.isUndefined(mention.localName) || mention.localName !== 'mention') {
					continue;
				}
				result[i] = {};
				for (var child = mention.firstChild; child; child = child.nextSibling) {
					if(_.isUndefined(child.localName) || !child.localName.startsWith('mention')) {
						continue;
					}
					result[i][child.localName] = child.textContent;
				}
			}
			return result;
		}
	});

	OCA.Comments.CommentModel = CommentModel;
})(OC, OCA);


/*
 * Copyright (c) 2016
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function(OC, OCA) {

	/**
	 * @class OCA.Comments.CommentCollection
	 * @classdesc
	 *
	 * Collection of comments assigned to a file
	 *
	 */
	var CommentCollection = OC.Backbone.Collection.extend(
		/** @lends OCA.Comments.CommentCollection.prototype */ {

		sync: OC.Backbone.davSync,

		model: OCA.Comments.CommentModel,

		/**
		 * Object type
		 *
		 * @type string
		 */
		_objectType: 'files',

		/**
		 * Object id
		 *
		 * @type string
		 */
		_objectId: null,

		/**
		 * True if there are no more page results left to fetch
		 *
		 * @type bool
		 */
		_endReached: false,

		/**
		 * Number of comments to fetch per page
		 *
		 * @type int
		 */
		_limit : 20,

		/**
		 * Initializes the collection
		 *
		 * @param {string} [options.objectType] object type
		 * @param {string} [options.objectId] object id
		 */
		initialize: function(models, options) {
			options = options || {};
			if (options.objectType) {
				this._objectType = options.objectType;
			}
			if (options.objectId) {
				this._objectId = options.objectId;
			}
		},

		url: function() {
			return OC.linkToRemote('dav') + '/comments/' +
				encodeURIComponent(this._objectType) + '/' +
				encodeURIComponent(this._objectId) + '/';
		},

		setObjectId: function(objectId) {
			this._objectId = objectId;
		},

		hasMoreResults: function() {
			return !this._endReached;
		},

		reset: function() {
			this._endReached = false;
			this._summaryModel = null;
			return OC.Backbone.Collection.prototype.reset.apply(this, arguments);
		},

		/**
		 * Fetch the next set of results
		 */
		fetchNext: function(options) {
			var self = this;
			if (!this.hasMoreResults()) {
				return null;
			}

			var body = '<?xml version="1.0" encoding="utf-8" ?>\n' +
				'<oc:filter-comments xmlns:D="DAV:" xmlns:oc="http://owncloud.org/ns">\n' +
				// load one more so we know there is more
				'    <oc:limit>' + (this._limit + 1) + '</oc:limit>\n' +
				'    <oc:offset>' + this.length + '</oc:offset>\n' +
				'</oc:filter-comments>\n';

			options = options || {};
			var success = options.success;
			options = _.extend({
				remove: false,
				parse: true,
				data: body,
				davProperties: CommentCollection.prototype.model.prototype.davProperties,
				success: function(resp) {
					if (resp.length <= self._limit) {
						// no new entries, end reached
						self._endReached = true;
					} else {
						// remove last entry, for next page load
						resp = _.initial(resp);
					}
					if (!self.set(resp, options)) {
						return false;
					}
					if (success) {
						success.apply(null, arguments);
					}
					self.trigger('sync', 'REPORT', self, options);
				}
			}, options);

			return this.sync('REPORT', this, options);
		},

		/**
		 * Returns the matching summary model
		 *
		 * @return {OCA.Comments.CommentSummaryModel} summary model
		 */
		getSummaryModel: function() {
			if (!this._summaryModel) {
				this._summaryModel = new OCA.Comments.CommentSummaryModel({
					id: this._objectId,
					objectType: this._objectType
				});
			}
			return this._summaryModel;
		},

		/**
		 * Updates the read marker for this comment thread
		 *
		 * @param {Date} [date] optional date, defaults to now
		 * @param {Object} [options] backbone options
		 */
		updateReadMarker: function(date, options) {
			options = options || {};

			return this.getSummaryModel().save({
				readMarker: (date || new Date()).toUTCString()
			}, options);
		}
	});

	OCA.Comments.CommentCollection = CommentCollection;
})(OC, OCA);



/*
 * Copyright (c) 2016
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function(OC, OCA) {

	_.extend(OC.Files.Client, {
		PROPERTY_READMARKER:	'{' + OC.Files.Client.NS_OWNCLOUD + '}readMarker'
	});

	/**
	 * @class OCA.Comments.CommentSummaryModel
	 * @classdesc
	 *
	 * Model containing summary information related to comments
	 * like the read marker.
	 *
	 */
	var CommentSummaryModel = OC.Backbone.Model.extend(
		/** @lends OCA.Comments.CommentSummaryModel.prototype */ {
		sync: OC.Backbone.davSync,

		/**
		 * Object type
		 *
		 * @type string
		 */
		_objectType: 'files',

		/**
		 * Object id
		 *
		 * @type string
		 */
		_objectId: null,

		davProperties: {
			'readMarker': OC.Files.Client.PROPERTY_READMARKER
		},

		/**
		 * Initializes the summary model
		 *
		 * @param {string} [options.objectType] object type
		 * @param {string} [options.objectId] object id
		 */
		initialize: function(attrs, options) {
			options = options || {};
			if (options.objectType) {
				this._objectType = options.objectType;
			}
		},

		url: function() {
			return OC.linkToRemote('dav') + '/comments/' +
				encodeURIComponent(this._objectType) + '/' +
				encodeURIComponent(this.id) + '/';
		}
	});

	OCA.Comments.CommentSummaryModel = CommentSummaryModel;
})(OC, OCA);


/*
 * Copyright (c) 2016
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

/* global Handlebars, escapeHTML */

(function(OC, OCA) {
	var TEMPLATE =
		'<ul class="comments">' +
		'</ul>' +
		'<div class="emptycontent hidden"><div class="icon-comment"></div>' +
		'<p>{{emptyResultLabel}}</p></div>' +
		'<input type="button" class="showMore hidden" value="{{moreLabel}}"' +
		' name="show-more" id="show-more" />' +
		'<div class="loading hidden" style="height: 50px"></div>';

	var EDIT_COMMENT_TEMPLATE =
		'<div class="newCommentRow comment" data-id="{{id}}">' +
		'    <div class="authorRow">' +
		'        <div class="avatar" data-username="{{actorId}}"></div>' +
		'        <div class="author">{{actorDisplayName}}</div>' +
		'{{#if isEditMode}}' +
		'        <a href="#" class="action delete icon icon-delete has-tooltip" title="{{deleteTooltip}}"></a>' +
		'{{/if}}' +
		'    </div>' +
		'    <form class="newCommentForm">' +
		'        <textarea rows="1" class="message" placeholder="{{newMessagePlaceholder}}">{{message}}</textarea>' +
		'        <input class="submit icon-confirm" type="submit" value="" />' +
		'{{#if isEditMode}}' +
		'        <input class="cancel pull-right" type="button" value="{{cancelText}}" />' +
		'{{/if}}' +
		'        <div class="submitLoading icon-loading-small hidden"></div>'+
		'    </form>' +
		'</div>';

	var COMMENT_TEMPLATE =
		'<li class="comment{{#if isUnread}} unread{{/if}}{{#if isLong}} collapsed{{/if}}" data-id="{{id}}">' +
		'    <div class="authorRow">' +
		'        <div class="avatar" {{#if actorId}}data-username="{{actorId}}"{{/if}}> </div>' +
		'        <div class="author">{{actorDisplayName}}</div>' +
		'{{#if isUserAuthor}}' +
		'        <a href="#" class="action edit icon icon-rename has-tooltip" title="{{editTooltip}}"></a>' +
		'{{/if}}' +
		'        <div class="date has-tooltip live-relative-timestamp" data-timestamp="{{timestamp}}" title="{{altDate}}">{{date}}</div>' +
		'    </div>' +
		'    <div class="message">{{{formattedMessage}}}</div>' +
		'{{#if isLong}}' +
		'    <div class="message-overlay"></div>' +
		'{{/if}}' +
		'</li>';

	/**
	 * @memberof OCA.Comments
	 */
	var CommentsTabView = OCA.Files.DetailTabView.extend(
		/** @lends OCA.Comments.CommentsTabView.prototype */ {
		id: 'commentsTabView',
		className: 'tab commentsTabView',

		events: {
			'submit .newCommentForm': '_onSubmitComment',
			'click .showMore': '_onClickShowMore',
			'click .action.edit': '_onClickEditComment',
			'click .action.delete': '_onClickDeleteComment',
			'click .cancel': '_onClickCloseComment',
			'click .comment': '_onClickComment'
		},

		_commentMaxLength: 1000,

		initialize: function() {
			OCA.Files.DetailTabView.prototype.initialize.apply(this, arguments);
			this.collection = new OCA.Comments.CommentCollection();
			this.collection.on('request', this._onRequest, this);
			this.collection.on('sync', this._onEndRequest, this);
			this.collection.on('add', this._onAddModel, this);

			this._commentMaxThreshold = this._commentMaxLength * 0.9;

			// TODO: error handling
			_.bindAll(this, '_onTypeComment');
		},

		template: function(params) {
			if (!this._template) {
				this._template = Handlebars.compile(TEMPLATE);
			}
			var currentUser = OC.getCurrentUser();
			return this._template(_.extend({
				actorId: currentUser.uid,
				actorDisplayName: currentUser.displayName
			}, params));
		},

		editCommentTemplate: function(params) {
			if (!this._editCommentTemplate) {
				this._editCommentTemplate = Handlebars.compile(EDIT_COMMENT_TEMPLATE);
			}
			var currentUser = OC.getCurrentUser();
			return this._editCommentTemplate(_.extend({
				actorId: currentUser.uid,
				actorDisplayName: currentUser.displayName,
				newMessagePlaceholder: t('comments', 'New comment …'),
				deleteTooltip: t('comments', 'Delete comment'),
				submitText: t('comments', 'Post'),
				cancelText: t('comments', 'Cancel')
			}, params));
		},

		commentTemplate: function(params) {
			if (!this._commentTemplate) {
				this._commentTemplate = Handlebars.compile(COMMENT_TEMPLATE);
			}

			params = _.extend({
				editTooltip: t('comments', 'Edit comment'),
				isUserAuthor: OC.getCurrentUser().uid === params.actorId,
				isLong: this._isLong(params.message)
			}, params);

			if (params.actorType === 'deleted_users') {
				// makes the avatar a X
				params.actorId = null;
				params.actorDisplayName = t('comments', '[Deleted user]');
			}

			return this._commentTemplate(params);
		},

		getLabel: function() {
			return t('comments', 'Comments');
		},

		setFileInfo: function(fileInfo) {
			if (fileInfo) {
				this.model = fileInfo;
				this.render();
				this.collection.setObjectId(fileInfo.id);
				// reset to first page
				this.collection.reset([], {silent: true});
				this.nextPage();
			} else {
				this.model = null;
				this.render();
				this.collection.reset();
			}
		},

		render: function() {
			this.$el.html(this.template({
				emptyResultLabel: t('comments', 'No comments yet, start the conversation!'),
				moreLabel: t('comments', 'More comments …')
			}));
			this.$el.find('.comments').before(this.editCommentTemplate({}));
			this.$el.find('.has-tooltip').tooltip();
			this.$container = this.$el.find('ul.comments');
			this.$el.find('.avatar').avatar(OC.getCurrentUser().uid, 32);
			this.delegateEvents();
			this.$el.find('.message').on('keydown input change', this._onTypeComment);

			autosize(this.$el.find('.newCommentRow textarea'))
		},

		_formatItem: function(commentModel) {
			var timestamp = new Date(commentModel.get('creationDateTime')).getTime();
			var data = _.extend({
				timestamp: timestamp,
				date: OC.Util.relativeModifiedDate(timestamp),
				altDate: OC.Util.formatDate(timestamp),
				formattedMessage: this._formatMessage(commentModel.get('message'), commentModel.get('mentions'))
			}, commentModel.attributes);
			return data;
		},

		_toggleLoading: function(state) {
			this._loading = state;
			this.$el.find('.loading').toggleClass('hidden', !state);
		},

		_onRequest: function(type) {
			if (type === 'REPORT') {
				this._toggleLoading(true);
				this.$el.find('.showMore').addClass('hidden');
			}
		},

		_onEndRequest: function(type) {
			var fileInfoModel = this.model;
			this._toggleLoading(false);
			this.$el.find('.emptycontent').toggleClass('hidden', !!this.collection.length);
			this.$el.find('.showMore').toggleClass('hidden', !this.collection.hasMoreResults());

			if (type !== 'REPORT') {
				return;
			}

			// find first unread comment
			var firstUnreadComment = this.collection.findWhere({isUnread: true});
			if (firstUnreadComment) {
				// update read marker
				this.collection.updateReadMarker(
					null,
					{
						success: function() {
							fileInfoModel.set('commentsUnread', 0);
						}
					}
				);
			}
		},

		_onAddModel: function(model, collection, options) {
			var $el = $(this.commentTemplate(this._formatItem(model)));
			if (!_.isUndefined(options.at) && collection.length > 1) {
				this.$container.find('li').eq(options.at).before($el);
			} else {
				this.$container.append($el);
			}

			this._postRenderItem($el);
		},

		_postRenderItem: function($el) {
			$el.find('.has-tooltip').tooltip();
			$el.find('.avatar').each(function() {
				var $this = $(this);
				$this.avatar($this.attr('data-username'), 32);
			});

			var username = $el.find('.avatar').data('username');
			if (username !== oc_current_user) {
				$el.find('.authorRow .avatar, .authorRow .author').contactsMenu(
					username, 0, $el.find('.authorRow'));
			}

			var $message = $el.find('.message');
			this._postRenderMessage($message);
		},

		_postRenderMessage: function($el) {
			$el.find('.avatar').each(function() {
				var avatar = $(this);
				var strong = $(this).next();
				var appendTo = $(this).parent();

				$.merge(avatar, strong).contactsMenu(avatar.data('user'), 0, appendTo);
			});
		},

		/**
		 * Convert a message to be displayed in HTML,
		 * converts newlines to <br> tags.
		 */
		_formatMessage: function(message, mentions) {
			message = escapeHTML(message).replace(/\n/g, '<br/>');

			for(var i in mentions) {
				var mention = '@' + mentions[i].mentionId;

				var avatar = '<div class="avatar" '
					+ 'data-user="' + _.escape(mentions[i].mentionId) + '"'
					+' data-user-display-name="'
					+ _.escape(mentions[i].mentionDisplayName) + '"></div>';

				// escape possible regex characters in the name
				mention = mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				var displayName = ''
					+ '<span class="avatar-name-wrapper">'
					+ avatar + ' <strong>'+ _.escape(mentions[i].mentionDisplayName)+'</strong>'
					+ '</span>';

				// replace every mention either at the start of the input or after a whitespace
				// followed by a non-word character.
				message = message.replace(new RegExp("(^|\\s)(" + mention + ")\\b", 'g'),
					function(match, p1) {
						// to  get number of whitespaces (0 vs 1) right
						return p1+displayName;
					}
				);
			}

			return message;
		},

		nextPage: function() {
			if (this._loading || !this.collection.hasMoreResults()) {
				return;
			}

			this.collection.fetchNext();
		},

		_onClickEditComment: function(ev) {
			ev.preventDefault();
			var $comment = $(ev.target).closest('.comment');
			var commentId = $comment.data('id');
			var commentToEdit = this.collection.get(commentId);
			var $formRow = $(this.editCommentTemplate(_.extend({
				isEditMode: true,
				submitText: t('comments', 'Save')
			}, commentToEdit.attributes)));

			$comment.addClass('hidden').removeClass('collapsed');
			// spawn form
			$comment.after($formRow);
			$formRow.data('commentEl', $comment);
			$formRow.find('textarea').on('keydown input change', this._onTypeComment);

			// copy avatar element from original to avoid flickering
			$formRow.find('.avatar:first').replaceWith($comment.find('.avatar:first').clone());
			$formRow.find('.has-tooltip').tooltip();

			// Enable autosize
			autosize($formRow.find('textarea'));

			return false;
		},

		_onTypeComment: function(ev) {
			var $field = $(ev.target);
			var len = $field.val().length;
			var $submitButton = $field.data('submitButtonEl');
			if (!$submitButton) {
				$submitButton = $field.closest('form').find('.submit');
				$field.data('submitButtonEl', $submitButton);
			}
			$field.tooltip('hide');
			if (len > this._commentMaxThreshold) {
				$field.attr('data-original-title', t('comments', 'Allowed characters {count} of {max}', {count: len, max: this._commentMaxLength}));
				$field.tooltip({trigger: 'manual'});
				$field.tooltip('show');
				$field.addClass('error');
			}

			var limitExceeded = (len > this._commentMaxLength);
			$field.toggleClass('error', limitExceeded);
			$submitButton.prop('disabled', limitExceeded);

			//submits form on ctrl+Enter or cmd+Enter
			if (ev.keyCode === 13 && (ev.ctrlKey || ev.metaKey)) {
				$submitButton.click();
			}
		},

		_onClickComment: function(ev) {
			var $row = $(ev.target);
			if (!$row.is('.comment')) {
				$row = $row.closest('.comment');
			}
			$row.removeClass('collapsed');
		},

		_onClickCloseComment: function(ev) {
			ev.preventDefault();
			var $row = $(ev.target).closest('.comment');
			$row.data('commentEl').removeClass('hidden');
			$row.remove();
			return false;
		},

		_onClickDeleteComment: function(ev) {
			ev.preventDefault();
			var $comment = $(ev.target).closest('.comment');
			var commentId = $comment.data('id');
			var $loading = $comment.find('.submitLoading');

			$comment.addClass('disabled');
			$loading.removeClass('hidden');
			this.collection.get(commentId).destroy({
				success: function() {
					$comment.data('commentEl').remove();
					$comment.remove();
				},
				error: function() {
					$loading.addClass('hidden');
					$comment.removeClass('disabled');
					OC.Notification.showTemporary(t('comments', 'Error occurred while retrieving comment with id {id}', {id: commentId}));
				}
			});

			return false;
		},

		_onClickShowMore: function(ev) {
			ev.preventDefault();
			this.nextPage();
		},

		/**
		 * takes care of updating comment elements after submit (either new
		 * comment or edit).
		 *
		 * @param {OC.Backbone.Model} model
		 * @param {jQuery} $form
		 * @param {string|undefined} commentId
		 * @private
		 */
		_onSubmitSuccess: function(model, $form, commentId) {
			var self = this;
			var $submit = $form.find('.submit');
			var $loading = $form.find('.submitLoading');
			var $textArea = $form.find('.message');

			model.fetch({
				success: function(model) {
					$submit.removeClass('hidden');
					$loading.addClass('hidden');
					var $target;

					if(!_.isUndefined(commentId)) {
						var $row = $form.closest('.comment');
						$target = $row.data('commentEl');
						$target.removeClass('hidden');
						$row.remove();
					} else {
						$target = $('.commentsTabView .comments').find('li:first');
						$textArea.val('').prop('disabled', false);
					}

					var $message = $target.find('.message');
					$message
						.html(self._formatMessage(model.get('message'), model.get('mentions')))
						.find('.avatar')
						.each(function () { $(this).avatar(); });

					self._postRenderMessage($message);
				},
				error: function () {
					self._onSubmitError($form, commentId);
				}
			});
		},

		_onSubmitComment: function(e) {
			var self = this;
			var $form = $(e.target);
			var commentId = $form.closest('.comment').data('id');
			var currentUser = OC.getCurrentUser();
			var $submit = $form.find('.submit');
			var $loading = $form.find('.submitLoading');
			var $textArea = $form.find('.message');
			var message = $textArea.val().trim();
			e.preventDefault();

			if (!message.length || message.length > this._commentMaxLength) {
				return;
			}

			$textArea.prop('disabled', true);
			$submit.addClass('hidden');
			$loading.removeClass('hidden');

			if (commentId) {
				// edit mode
				var comment = this.collection.get(commentId);
				comment.save({
					message: $textArea.val()
				}, {
					success: function(model) {
						self._onSubmitSuccess(model, $form, commentId);
					},
					error: function() {
						self._onSubmitError($form, commentId);
					}
				});
			} else {
				this.collection.create({
					actorId: currentUser.uid,
					actorDisplayName: currentUser.displayName,
					actorType: 'users',
					verb: 'comment',
					message: $textArea.val(),
					creationDateTime: (new Date()).toUTCString()
				}, {
					at: 0,
					// wait for real creation before adding
					wait: true,
					success: function(model) {
						self._onSubmitSuccess(model, $form);
					},
					error: function() {
						self._onSubmitError($form);
					}
				});
			}

			return false;
		},

		/**
		 * takes care of updating the UI after an error on submit (either new
		 * comment or edit).
		 *
		 * @param {jQuery} $form
		 * @param {string|undefined} commentId
		 * @private
		 */
		_onSubmitError: function($form, commentId) {
			$form.find('.submit').removeClass('hidden');
			$form.find('.submitLoading').addClass('hidden');
			$form.find('.message').prop('disabled', false);

			if(!_.isUndefined(commentId)) {
				OC.Notification.show(t('comments', 'Error occurred while updating comment with id {id}', {id: commentId}), {type: 'error'});
			} else {
				OC.Notification.show(t('comments', 'Error occurred while posting comment'), {type: 'error'});
			}
		},

		/**
		 * Returns whether the given message is long and needs
		 * collapsing
		 */
		_isLong: function(message) {
			return message.length > 250 || (message.match(/\n/g) || []).length > 1;
		}
	});

	OCA.Comments.CommentsTabView = CommentsTabView;
})(OC, OCA);


/*
 * Copyright (c) 2016 Vincent Petry <pvince81@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

/* global Handlebars */

(function() {

	_.extend(OC.Files.Client, {
		PROPERTY_COMMENTS_UNREAD:	'{' + OC.Files.Client.NS_OWNCLOUD + '}comments-unread'
	});

	var TEMPLATE_COMMENTS_UNREAD =
		'<a class="action action-comment permanent" title="{{countMessage}}" href="#">' +
		'<img class="svg" src="{{iconUrl}}"/>' +
		'</a>';

	OCA.Comments = _.extend({}, OCA.Comments);
	if (!OCA.Comments) {
		/**
		 * @namespace
		 */
		OCA.Comments = {};
	}

	/**
	 * @namespace
	 */
	OCA.Comments.FilesPlugin = {
		ignoreLists: [
			'files_trashbin',
			'files.public'
		],

		_formatCommentCount: function(count) {
			if (!this._commentsUnreadTemplate) {
				this._commentsUnreadTemplate = Handlebars.compile(TEMPLATE_COMMENTS_UNREAD);
			}
			return this._commentsUnreadTemplate({
				count: count,
				countMessage: n('comments', '%n unread comment', '%n unread comments', count),
				iconUrl: OC.imagePath('core', 'actions/comment')
			});
		},

		attach: function(fileList) {
			var self = this;
			if (this.ignoreLists.indexOf(fileList.id) >= 0) {
				return;
			}

			fileList.registerTabView(new OCA.Comments.CommentsTabView('commentsTabView'));

			var oldGetWebdavProperties = fileList._getWebdavProperties;
			fileList._getWebdavProperties = function() {
				var props = oldGetWebdavProperties.apply(this, arguments);
				props.push(OC.Files.Client.PROPERTY_COMMENTS_UNREAD);
				return props;
			};

			fileList.filesClient.addFileInfoParser(function(response) {
				var data = {};
				var props = response.propStat[0].properties;
				var commentsUnread = props[OC.Files.Client.PROPERTY_COMMENTS_UNREAD];
				if (!_.isUndefined(commentsUnread) && commentsUnread !== '') {
					data.commentsUnread = parseInt(commentsUnread, 10);
				}
				return data;
			});

			fileList.$el.addClass('has-comments');
			var oldCreateRow = fileList._createRow;
			fileList._createRow = function(fileData) {
				var $tr = oldCreateRow.apply(this, arguments);
				if (fileData.commentsUnread) {
					$tr.attr('data-comments-unread', fileData.commentsUnread);
				}
				return $tr;
			};

			// register "comment" action for reading comments
			fileList.fileActions.registerAction({
				name: 'Comment',
				displayName: t('comments', 'Comment'),
				mime: 'all',
				permissions: OC.PERMISSION_READ,
				type: OCA.Files.FileActions.TYPE_INLINE,
				render: function(actionSpec, isDefault, context) {
					var $file = context.$file;
					var unreadComments = $file.data('comments-unread');
					if (unreadComments) {
						var $actionLink = $(self._formatCommentCount(unreadComments));
						context.$file.find('a.name>span.fileactions').append($actionLink);
						return $actionLink;
					}
					return '';
				},
				actionHandler: function(fileName, context) {
					context.$file.find('.action-comment').tooltip('hide');
					// open sidebar in comments section
					context.fileList.showDetailsView(fileName, 'commentsTabView');
				}
			});

			// add attribute to "elementToFile"
			var oldElementToFile = fileList.elementToFile;
			fileList.elementToFile = function($el) {
				var fileInfo = oldElementToFile.apply(this, arguments);
				var commentsUnread = $el.data('comments-unread');
				if (commentsUnread) {
					fileInfo.commentsUnread = commentsUnread;
				}
				return fileInfo;
			};
		}
	};

})();

OC.Plugins.register('OCA.Files.FileList', OCA.Comments.FilesPlugin);


/*
 * @author Joas Schilling <coding@schilljs.com>
 * Copyright (c) 2016
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 */

(function() {
	OCA.Comments.ActivityTabViewPlugin = {

		/**
		 * Prepare activity for display
		 *
		 * @param {OCA.Activity.ActivityModel} model for this activity
		 * @param {jQuery} $el jQuery handle for this activity
		 * @param {string} view The view that displayes this activity
		 */
		prepareModelForDisplay: function (model, $el, view) {
			if (model.get('app') !== 'comments' || model.get('type') !== 'comments') {
				return;
			}

			if (view === 'ActivityTabView') {
				$el.addClass('comment');
				if (model.get('message') && this._isLong(model.get('message'))) {
					$el.addClass('collapsed');
					var $overlay = $('<div>').addClass('message-overlay');
					$el.find('.activitymessage').after($overlay);
					$el.on('click', this._onClickCollapsedComment);
				}
			}
		},

		/*
		 * Copy of CommentsTabView._onClickComment()
		 */
		_onClickCollapsedComment: function(ev) {
			var $row = $(ev.target);
			if (!$row.is('.comment')) {
				$row = $row.closest('.comment');
			}
			$row.removeClass('collapsed');
		},

		/*
		 * Copy of CommentsTabView._isLong()
		 */
		_isLong: function(message) {
			return message.length > 250 || (message.match(/\n/g) || []).length > 1;
		}
	};


})();

OC.Plugins.register('OCA.Activity.RenderingPlugins', OCA.Comments.ActivityTabViewPlugin);

