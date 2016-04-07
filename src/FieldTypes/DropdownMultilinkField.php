<?php
namespace Concrete\Package\BasicTablePackage\Src\FieldTypes;

use Concrete\Core\Block\BlockController;
use Concrete\Package\BasicTablePackage\Src\FieldTypes\Field as Field;
use Concrete\Package\BasicTablePackage\Src\FieldTypes\DropdownField as DropdownField;
use Concrete\Package\BasicTablePackage\Src\FieldTypes\DropdownLinkField as DropdownLinkField;
use Loader;
use Page;
use User;
use Core;
use File;
use Concrete\Controller\SinglePage\Dashboard\Block\Permissions as Permissions;
use Concrete\Core\Block\View\BlockView as View;
use Concrete\Package\BasicTablePackage\Src\FieldTypes\SelfSaveInterface as SelfSaveInterface;
use Doctrine\Common\Collections\ArrayCollection;

class DropdownMultilinkField extends DropdownLinkField implements SelfSaveInterface{
    protected $linktable;
    protected $ntomtable;
    protected $sqlfilter = " 1=1 ";
    protected $sqlvars = array();
    protected $showcolumn;
    protected $isNullable = false;
    protected $linkfieldself;
    protected $linkfieldext;
    protected $rowid;
    protected $idfieldext;
    protected $idfieldself;
    protected $values = array();
    protected $allowAdd = false;



    /**
     * set the tablename of the n to m table
     * @param String $tablename
     */
    public function setNtoMTable( $tablename){
        $this->ntomtable = $tablename;
    }

    /**
     * set the colname of the column that points to the self table
     * @param String $colname
     */
    public function setLinkFieldSelf( $colname){
        $this->linkfieldself = $colname;
    }

    /**
     * set the colname of the column that points to the extern table
     * @param String $colname
     */
    public function setLinkFieldExt( $colname){
        $this->linkfieldext = $colname;
    }


    /**
     * set the colname of the idfield of the own table
     * @param String $colname
     */
    public function setIdFieldSelf( $colname){
        $this->idfieldself = $colname;
    }

    public function getIdFieldSelf(){
        return $this->idfieldself;
    }

    /**
     * set the colname id Field in the linktable
     * @param String $colname
     */
    public function setIdFieldExt( $colname){
        $this->idfieldext = $colname;
    }

    /**
     * set the id of the row the col is in
     * @param String $colname
     */
    public function setRowId( $id){
        $this->rowid = $id;
        $this->value = array();
    }

    public function setAllowAdd($isAllowed = true){
        $this->allowAdd = $isAllowed;
    }

    public function setValue($value){

        $this->value = $value;
    }

    public function getTableView(){
        $values = $this->getValues();
        return implode(", ", $values);
    }


    public function getFormView($form){
        $html = "<label for='".$this->getPostName()."'>".$this->getLabel()."</label>";


        $values = $this->getValues()->toArray();

        $valueStrings = array();

        //to display the values, we have to convert them to strings with our getDisplayString function
        $displayFunction = $this->getDisplayString;
        foreach($values as $num => $entity){

            $valueStrings[]= $displayFunction($entity);
        }


        $valuestring = implode(", ", $valueStrings);
        $html .= "<input type='text' width = '100%' id='".$this->getPostName()."' name ='".$this->getPostName()."' value='$valuestring'/>";


        $options = $this->getOptions();
        $sourcetext = "'".implode("', '", $options)."'";
        $allowadd = 'false';
        if($this->allowAdd){
            $allowadd = 'true';
        }

        $html .="
				<script type = 'text/javascript'>
					$(document).ready(function(e){
						$('#".$this->getPostName()."').tagsinput({
						  freeInput: $allowadd,
						  typeahead: {
						    source: [$sourcetext],
						    showHintOnFocus:true
						  }
						});
					});
				</script>
				";
        return $html;
    }



    public function getValue(){
        return $this->value;
    }





    public function validatePost($value){


        $postvalues = explode(",", $value);
        $targetModelForIdField = new $this->targetEntity;
        $options = $this->getOptions();

        $flipoptions = array_flip($options);

        $sqlArray = new ArrayCollection();
        foreach($postvalues as $num => $postvalue){
            if(in_array($postvalue, $options)){
                $findItem = $this->getEntityManager()
                    ->getRepository($this->targetEntity)
                    ->findOneBy(array(
                        $targetModelForIdField->getIdFieldname()=>$flipoptions[$postvalue]
                    ));
                $sqlArray->add($findItem);
            }else{
               //TODO throw exception, if invalid values should produce an error message
            }
        }
        $this->setSQLValue($sqlArray);
        return true;
    }

    /**
     * get the Values of
     * @return Ambigous <multitype:, unknown>
     */
    private function getValues(){
        if(count($this->value)==0 && !is_null($this->rowid)) {
            $modelForIdField = new $this->targetEntity;
            /**
             * @var $model \Entity
             */
            $model = $this->getEntityManager()
                ->getRepository($this->targetEntity)
                ->findOne(array(
                    $modelForIdField->getIdFieldName() => $this->rowid
                ));
            $values = $model->get($this->sourceField);
            if(count($values)>0 && $values != null) {
                foreach ($model->get($this->sourceField) as $valnum => $value) {
                    $this->value[$value->getId()]=$this->getDisplayString($value);
                }
            }
        }

        return $this->value;
        /*
		if(count($this->values)==0 && !is_null($this->rowid)){



			$db = Loader::db();
			$sql = "SELECT l.".$this->idfieldext." as schluessel,l.".$this->showcolumn." as value FROM
					".$this->linktable." l
					JOIN ".$this->ntomtable." nm ON l.".$this->idfieldext." = nm.".$this->linkfieldext."
					WHERE nm.".$this->linkfieldself." = ?
					";
			if(strlen($this->sqlfilter) > 0){
				$sql .= " AND ".$this->sqlfilter;
			}
			$filtervalues = array($this->rowid);
			if(count($this->sqlvars)>0){
				$filtervalues+=$this->sqlvars;
			}
			$r = $db->query($sql, array($this->rowid));

			while ($row = $r->fetchRow()) {
				$this->values[$row['schluessel']]=$row['value'];
			}
		}
		return $this->values;
        */
    }


    public function saveValues($value= null){
        $db = Loader::db();

        if($this->rowid == null){
            //throw some exception or so
            return;
        }

        $modelForIdField = new $this->sourceEntity();
        $model = $this->getEntityManager()
            ->getRepository($this->targetEntity)
            ->findOne(array(
                $modelForIdField->getIdFieldName() => $this->rowid
            ));


        //if no insert value
        if($value == null){
            $value = $this->value;
        }


		$currentdbvalues = $this->getValues();
        $model->set($this->sourceField, new ArrayCollection());
        //if no value property is set
        if($value == null){
            return;
        }
        //first compare the possible, posted and db values



        $postvalues = explode(",", $value);

        $options = $this->getOptions();


        $flippedoptions = array_flip($options);

        $checkedoptions = array();
        $checkedoptionids = array();



        foreach($currentdbvalues as $key => $value){
            $checkedoptions[$value]= $key;
        }
        $currentArray = [];
        foreach($postvalues as $num => $postvalue){
            $insert = false;
            $id = null;

            //check if the option is already in db
            if(isset($checkedoptions[$postvalue])){
                $checkedoptions[$postvalue]=1;
            }elseif(in_array($postvalue, $options)){
                //option is possible

                $id = $flippedoptions[$postvalue];
                $insert = true;

            }else if($this->allowAdd){
                //TODO allowadd difficult, because identifiying the right columns is difficult
                //not existing, but adding allowed, insert new linktable row and then insert
                /*$aff=$db->insert($this->linktable, array($this->showcolumn => $postvalue));
                if($aff > 0){
                    $id = $db->lastInsertId();
                    $insert = true;
                }*/
            }
            if($insert){
                $currentArray = $model->get($this->sourceField);
                $targetModelForIdField = new $this->targetEntity;
                //add new value
                $currentArray[]=$this->getEntityManager()
                    ->getRepository($this->targetEntity)
                    ->findOne(array(
                        $targetModelForIdField->getIdFieldname()=>$id
					));



				//var_dump($aff);
				//exit;
				//if error, do error logging, throw exception, dunno
			}

        }
        $model->set($this->sourceField, new ArrayCollection($currentArray));
        $this->em->persist($model);
        $this->em->flush($model);

    }

    public function setSQLValue($value){
        if(count($value)==0){
            $this->value=new ArrayCollection();
        }elseif($value instanceof ArrayCollection){
            //check if values are of the right entitiy
            foreach($value->toArray() as $valnum => $valueitem){
                if(!$valueitem instanceof $this->targetEntity){
                    throw new InvalidArgumentException("Item number $valnum is ".get_class($valueitem).", should be ".$this->targetEntity." sein");
                }
            }
            $this->value = $value;
        }


    }



}