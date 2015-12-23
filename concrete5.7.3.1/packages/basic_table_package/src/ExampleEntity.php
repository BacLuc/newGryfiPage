<?php
/**
 * Created by PhpStorm.
 * User: lucius
 * Date: 21.12.15
 * Time: 14:53
 */

namespace Concrete\Package\BasicTablePackage\Src;



/**
 * Class ExampleEntity
 * @package Concrete\Package\BasicTablePackage\Src
 * @Entity
 * @Table(name="btExampleEntity")
 */
class ExampleEntity extends Entity
{
    /**
     * @var int
     * @Id @Column(type="integer")
     * @GEneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     * @Column(type="string")
     */
    protected $value;


    public function __construct(){
        $this->fieldTypes['id']=new FieldTypes\Field('id', 'ID', 'identifier');
        $this->fieldTypes['value']=new FieldTypes\Field('value', 'Wert', 'wert');
    }

}