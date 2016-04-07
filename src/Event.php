<?php
/**
 * Created by PhpStorm.
 * User: lucius
 * Date: 01.02.16
 * Time: 23:08
 */

namespace Concrete\Package\BaclucEventPackage\Src;
use Concrete\Package\BasicTablePackage\Src\Entity;
use Concrete\Package\BasicTablePackage\Src\FieldTypes\DateField as DateField;
use Concrete\Package\BasicTablePackage\Src\FieldTypes\FileField as FileField;
use Concrete\Package\BasicTablePackage\Src\FieldTypes\WysiwygField as WysiwygField;

/**
 * Class Event
 * @package Concrete\Package\BaclucEventPackage\Src
 * @Entity
  @Table(name="BaclucEvents"

  )
 *
 */
class Event extends Entity
{

    /**
     * @var int
     * @Id @Column(type="integer", nullable=false, options={"unsigned":true})
     * @GEneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var DateTime
     * @Column(type="date")
     */
    private $date_from;

    /**
     * @var DateTime
     * @Column(type="date")
     */
    private $date_to;

    /**
     * @var DateTime
     * @Column(type="text", length=12)
     */
    private $time_from;


    /**
     * @var DateTime
     * @Column(type="text", length=12)
     */
    private $time_to;

    /**
     * @var string
     * @Column(type="string", length=1000)
     */
    private $title;

    /**
     * @var string
     * @Column(type="text")
     */
    private $description;

    /**
     * @var int
     * @Column(type="integer")
     */
    private $infofile;

    /**
     * @var int
     * @Column(type="integer")
     */
    private $registerfile;


    public function __construct(){
        parent::__construct();
        $this->setDefaultFieldTypes();
    }

    public function setDefaultFieldTypes(){
        parent::setDefaultFieldTypes();
        $this->fieldTypes['description']=new WysiwygField("description",t("Description"),"description");
        $this->fieldTypes['infofile']= new FileField("infofile", t('Info'), "info");
        $this->fieldTypes['registerfile']= new FileField("registerfile", t('Anmeldung'), "register");
    }



    public function get($name)
    {
        if(property_exists($this, $name)
            && !in_array($name, $this->protect)
            && !in_array($name, $this->protectRead)
            && !in_array($name, $this->fieldTypes)) {

            $returnvar = $this->{$name};


            return $returnvar;
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
        $returnvar = $this->get($name);
        return $returnvar;
    }

    public function __set($name, $value)
    {
        $this->set($name, $value);
    }

    public function getId(){
        return $this->id;
    }

    public function getIdFieldName()
    {
        return 'id';
    }

    public static function getDefaultGetDisplayStringFunction(){
        $function = function(Event $item){
            $dateField = new DateField("test", "test", "test");

            $returnString =$item->title;
            $dateField->setSQLValue($item->date_from);
            $returnString.= " ".$dateField->getTableView();
            if($item->date_to != null){
                $returnString =$item->title;
                $dateField->setSQLValue($item->date_to);
                $returnString.= " ".$dateField->getTableView();
            }

            return $returnString;
        };
        return $function;
    }




}