# The BlockOptions Folder /src/BlockOptions
That we can use the FieldTypes implemented for the basic_table_block_packaged for the configuration of the Blocks, the Blockoptions are implemented as Entites.
We have the base class TableBlockOption, which is linked to the BasicTableInstance. The other Block Options extend this base BlockOption.
#### DropdownBlockOption.php
 [DropdownBlockOption.php](DropdownBlockOption.php)  
 A Block Option with predefined Options you can choose from. Uses the Dropdown Field.

#### GroupRefOption.php
 [GroupRefOption.php](GroupRefOption.php)  
 This Blockoptions holds links to Groups. It can be used to allow certain actions only to certain groups.
 
#### GroupRefOptionGroup.php
 [GroupRefOptionGroup.php](GroupRefOptionGroup.php)  
 Because there where problems linking the BlockOption directly to the Group 
 (Because i could not use a ManyToMany Relation without mappedBy Attribute somehow)
 We have here a cross table generated by a AssociationBaseEntity.
 
#### TableBlockOption.php
  [TableBlockOption.php](TableBlockOption.php)  
  The base class for TableBlockOptions. For usage, the function getValue is important. For Extension, you have to consider the following methods:
  * __construct()  
  If you have a collection valued value, you need to set the property you want to use to an Empty ArrayCollection, if it is null. (Like in every enttiy).
  * getFieldType()  
  If you don't want to use the column value (which is a text column), you have to return the fieldtype of another Field.
  And set the Label and postname right.
  And if the fieldTypes are not yet set, you have to set them.  
```php
  <?php
  function getFieldType(){
          if($this->fieldTypes['optionValue']==null){
              $this->setDefaultFieldTypes();
          }
          if($this->optionName != null){
              $this->fieldTypes['GroupAssociations']->setLabel($this->optionName);
              $this->fieldTypes['GroupAssociations']->setPostName(str_replace(" ", "", $this->optionName));
          }
          return $this->fieldTypes['GroupAssociations'];
      }
```
  * getValue()  
  If you use another column than value, you have to return its value instead of the value of the column value.
  * setValue($value)  
  same as above
  
#### TextBlockOption.php
  [TextBlockOption.php](TextBlockOption.php)  
  Extension of the TableBlockOption with no changes, just that we can distinguish between the base class and the class we instantiate.