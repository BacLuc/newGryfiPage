
<div class="form-group">
	
	<form action=<?php echo $this->action('save_row') ?> method='POST'>
	
	<?php 
	$fields = $controller->getFields();
	$rowValues = $controller->getRowValues();
	
	foreach($fields as $field => $FieldObject){
		if($field == 'id'){
			
		}else{
			$FieldObject->setValue($rowValues[$FieldObject->getSQLFieldName()]);
			
			echo $FieldObject->getFormView($form);
			
		}	
	
	}
	
	echo $form->submit('submit', t("speichern"));
	echo $form->submit('cancel', t("abbrechen"));
	?>
	
	
	
	
	</form>

</div>

