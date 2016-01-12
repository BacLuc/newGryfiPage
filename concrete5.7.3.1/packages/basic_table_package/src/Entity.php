<?php

/**
 * This is a simple helper class that provides visibility to the object
 * properties outside of this class. By default, all properties are readable
 * and writable from outside of the entity class but each property can be
 * protected from both outside actions (read or write) with the $protect,
 * $protectRead and $protectWrite arrays as follows:
 * 
 * $protect      - All properties defined within this array are neither writable
 *                 nor readable. They are protected to be used only by this
 *                 entity class.
 * $protectRead  - All properties defined within this array are protected from
 *                 reading outside of this class. It means that they can only
 *                 be read within this entity class.
 * $protectWrite - All properties defined within this array are protected from
 *                 writing outside of this class. It means that they can only
 *                 be written within this entity class.
 * 
 * @author Antti Hukkanen <antti.hukkanen(at)mainiotech.fi>
 * @copyright 2014 Mainio Tech Ltd.
 * @license MIT
 */

namespace Concrete\Package\BasicTablePackage\Src;

use Concrete\Core\Package\Package;
use Concrete\Package\BasicTablePackage\Src\BlockOptions\CanEditOption;
use Concrete\Package\BasicTablePackage\Src\BlockOptions\TableBlockOption;
use Concrete\Package\BasicTablePackage\Src\FieldTypes\Field;

abstract class Entity
{

    protected $protect = array();
    protected $protectRead = array();
    protected $protectWrite = array();
    protected $fieldTypes = array();
    protected $em;

    public function __construct(){
       // $this->setDefaultFieldTypes();
    }

    public function get($name)
    {
        if(property_exists($this, $name)
            && !in_array($name, $this->protect)
            && !in_array($name, $this->protectRead)
            && !in_array($name, $this->fieldTypes)) {
            return $this->$name;
        }
    }

    public function set($name, $value)
    {
        if(property_exists($this, $name)
            && !in_array($name, $this->protect)
            && !in_array($name, $this->protectWrite)
            && !in_array($name, $this->fieldTypes)
        ) {
            $this->$name = $value;
        }
    }

    public function __get($name)
    {
        return $this->get($name);
    }

    public function __set($name, $value)
    {
        $this->set($name, $value);
    }

    public function setControllerFieldType($name, Field $field){
        if(property_exists($this, $name)
            && !in_array($name, $this->protect)
            && !in_array($name, $this->protectWrite)
            && !in_array($name, $this->fieldTypes)
        ) {
            $this->fieldTypes[$name]=$field;
        }
    }

    public function getFieldTypes(){
        if(count($this->fieldTypes) == 0){
            $this->__construct();
        }
        return $this->fieldTypes;
    }

    public function getAsAssoc(){
        $returnArray = array();
        foreach($this->fieldTypes as $key => $value){

            $returnArray[$key]=$this->get($key);
        }
        return $returnArray;
    }


    public function getEntityManager(){
        if($this->em == null){

            $pkg = Package::getByHandle('basic_table_package');
            $this->em = $pkg->getEntityManager();
            return $this->em;
        }else{
            return $this->em;
        }
    }

    public function setDefaultFieldTypes(){
        $className = get_class($this);
        $em = $this->getEntityManager();

        $metadata = $this->getEntityManager()->getClassMetadata($className);
        foreach ($metadata->fieldMappings as $field => $mapping) {
            switch($mapping['type']){
                default:
                    $this->fieldTypes[$field]=new Field( $field,t($field),t("post".$field));
                    break;
            }
        }

    }

}
