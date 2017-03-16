<?php
namespace Concrete\Package\BasicTablePackage\Src\FieldTypes;

use Concrete\Core\Block\BlockController;
use Concrete\Core\Form\Service\Form;
use Concrete\Package\BasicTablePackage\Src\FieldTypes\Field as Field;
use Loader;
use Page;
use User;
use Core;
use File;
use Concrete\Controller\SinglePage\Dashboard\Blocks\Permissions as Permissions;
use Concrete\Core\Block\View\BlockView as View;

/**
 *
 * Class DropdownField
 * @IgnoreAnnotation("package")\n*  Concrete\Package\BasicTablePackage\Src\FieldTypes
 * A Normal Dropdownfield for a form
 */
class BooleanField extends DropdownField {

	protected $options = array();

	public function __construct($sqlFieldname,$label, $postName){
		parent::__construct($sqlFieldname, $label, $postName);
        $this->setOptions(array());
	}

	/**
	 * Set the possible Options to choose from.
	 * @param array $options array of the options like array('dbvalue' => 'displayvalue')
	 * @return void
	 */
	public function setOptions (array $options){
		$this->options = array(
		    0 => t('No'),
            1 => t('Yes')
        );
        return $this;
	}



}
