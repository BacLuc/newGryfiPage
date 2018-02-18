# FieldTypes
FieldTypes are a Abstraction Layer to handle the task needed between having a value in php and displaying it to users,
and on the other hands validate the Post values sendt by user and convert it to a value usable in php.
For example the DateField:  
First you have a DateTime Class, which has to be displayed either as cell in a table according to localisation
(en_GB: 19/12/2016), or as form field with date picker. And if The user Post something with the Form field, you want at the end again a DateTime instance. So the way from a PHP Variable to display the value is:
 1. Field::setSQLValue($value);
 2. Field::getTableView();     
 
 
 The way from an PHP Variable to display the form with the value is:
 1. Field::setSQLValue($value);
 2. Field::getFormView(\Concrete\Serivce\Form $form, $clientSideValidationActivated = true);  
 
 
The way from a post to get the php value is:
 1. Field::validatePost($postvalue);
 2. $variable = Field::getSQLValue()  

If you want to create your own FieldType, you normally have to override the following methods, here the EmailField as Example:
```php
<?php
/**
 * Created by PhpStorm.
 * User: lucius
 * Date: 22.09.16
 * Time: 21:59
 */

namespace Concrete\Package\BasicTablePackage\Src\FieldTypes;


class EmailField extends Field
{
    const EMAILFORMATERROR = " has to be a valid email address";


    public function getFormView($form, $clientSideValidationActivated = true){
        $returnString = "<label for='".$this->getPostName()."'>".$this->getLabel()."</label>";
        $returnString.= $this->getInputHtml($form, $clientSideValidationActivated);
        return $returnString;
    }

    public function addValidationAttributes($attributes)
    {
        $attributes =  parent::addValidationAttributes($attributes); // TODO: Change the autogenerated stub
        $attributes['type']="email";
        $attributes['data-parsley-type']="email";
        return $attributes;
    }

    public function validatePost($value){
        if(!$this->nullable && strlen($value)==0) {
            $this->errMsg = $this->getLabel().t(static::NULLERRORMSG);
            return false;
        }

        if(!filter_var($value, FILTER_VALIDATE_EMAIL)){
            $this->errMsg = $this->getLabel().t(static::EMAILFORMATERROR);
            return false;

        }

        $this->value = $value;
        return true;
    }

    /**
     * @param $form
     * @param $clientSideValidationActivated
     * @param $returnString
     * @return string
     */
    public function getInputHtml($form, $clientSideValidationActivated)
    {
        $value = $this->getSQLValue();
        $default = $this->getDefault();
        if($value == null && $default != null){
            $value = $default;
        }

        $attributes = array('title' => $this->getPostName(),
            'value' => $value,
            'id' => $this->getHtmlId(),
        );

        if ($clientSideValidationActivated) {
            $attributes = $this->addValidationAttributes($attributes);
        }


        $returnString = static::inputType($this->getHtmlId(), $this->getPostName(), "text", $value, $attributes, $form);

        $returnString .= $this->getHtmlErrorMsg();
        return $returnString;
    }
}
```