<?php
namespace Concrete\Package\BaclucEventPackage;
defined('C5_EXECUTE') or die(_("Access Denied."));
use Concrete\Core\Block\BlockType\BlockType;
use Concrete\Core\Package\Package;
use Concrete\Core\Foundation\ClassLoader;
use Doctrine\ORM\Configuration;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Mapping\Driver\AnnotationDriver;
use Punic\Exception;
use Loader;
use Core;
use BlockTypeSet;
class Controller extends Package
{
    protected $pkgHandle = 'bacluc_event_package';
    protected $appVersionRequired = '5.7.4';
    protected $pkgVersion = '0.0.1';
    protected $pkgAutoloaderRegistries = array(
        //  'src/FieldTypes/Statistics' => '\BasicTablePackage\FieldTypes'
        'src'                      => 'Concrete\Package\BaclucEventPackage\Src'
    );
    public function getPackageName()
    {
        return t("BaclucEventPackage");
    }
    public function getPackageDescription()
    {
        return t("Package to Manage Events");
    }
    public function install()
    {
        $pre_pkg = Package::getByHandle('basic_table_package');
        if (!is_object($pre_pkg)){
            throw new Exception (t('To Install BaclucEventPackage, you have to Install BasicTablePackage first.
            @see <a href=\'https://github.com/BacLuc/basic_table_package\'>https://github.com/BacLuc/basic_table_package</a>'));
        }
        $em = $this->getEntityManager();
        //begin transaction, so when block install fails, but parent::install was successfully, you don't have to uninstall the package
        $em->getConnection()->beginTransaction();
        try {

            /**
             * @var EntityManager $em
             */


            //add basic_table_package/Src to the folder to look for entitiies
            $em = $this->getEntityManager();

            /**
             * @var Configuration $conf
             */
            $conf = $em->getConfiguration();

            /**
             * @var AnnotationDriver $driver
             */
            $driver = $conf->getMetadataDriverImpl();

            $driver->addPaths(array(__DIR__."/../basic_table_package/src"));
            $pkg = parent::install();
            //add blocktypeset
            if (!BlockTypeSet::getByHandle('bacluc_event_set')) {
                BlockTypeSet::add('bacluc_event_set', 'Appointment', $pkg);
            }
            BlockType::installBlockType("bacluc_event_block", $pkg);
            BlockType::installBlockType("bacluc_next_event_block", $pkg);
            $em->getConnection()->commit();
        }catch(Exception $e){
            $em->getConnection()->rollBack();
            throw $e;
        }
    }
    public function uninstall()
    {
        $eventblock = BlockType::getByHandle("bacluc_event_block");
        $nextEventblock = BlockType::getByHandle("bacluc_next_event_block");
        $em = $this->getEntityManager();
        //begin transaction, so when block install fails, but parent::install was successfully, you don't have to uninstall the package
        $em->getConnection()->beginTransaction();
        try{

            $db = Core::make('database');
            if(is_object($eventblock)) {
                $blockId = $eventblock->getBlockTypeID();
                //delete of blocktype not in orm way, because there is no entity BlockType
                $db->query("DELETE FROM BlockTypes WHERE btID = ?", array($blockId));
            }
            if(is_object($nextEventblock)) {
                $blockId = $nextEventblock->getBlockTypeID();
                //delete of blocktype not in orm way, because there is no entity BlockType
                $db->query("DELETE FROM BlockTypes WHERE btID = ?", array($blockId));
            }
            parent::uninstall();
            $em->getConnection()->commit();
        }catch(Exception $e){
            $em->getConnection()->rollBack();
            throw $e;
        }
    }

}