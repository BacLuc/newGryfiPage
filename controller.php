<?php
namespace Concrete\Package\BaclucPersonPackage;
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
    protected $pkgHandle = 'bacluc_person_package';
    protected $appVersionRequired = '5.7.4';
    protected $pkgVersion = '0.0.1';
    protected $pkgAutoloaderRegistries = array(
        //  'src/FieldTypes/Statistics' => '\BasicTablePackage\FieldTypes'
        'src'                      => 'Concrete\Package\BaclucPersonPackage\Src'
    );
    public function getPackageName()
    {
        return t("BaclucPersonPackage");
    }
    public function getPackageDescription()
    {
        return t("Package to Manage People");
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
            if (!BlockTypeSet::getByHandle('bacluc_person_set')) {
                BlockTypeSet::add('bacluc_person_set', 'People', $pkg);
            }
            $em->getConnection()->commit();
        }catch(Exception $e){
            $em->getConnection()->rollBack();
            throw $e;
        }
    }
    public function uninstall()
    {
        $em = $this->getEntityManager();
        //begin transaction, so when block install fails, but parent::install was successfully, you don't have to uninstall the package
        $em->getConnection()->beginTransaction();
        try{

            $db = Core::make('database');
//
//            if(is_object($eventblock)) {
//                $blockId = $eventblock->getBlockTypeID();
//                //delete of blocktype not in orm way, because there is no entity BlockType
//                $db->query("DELETE FROM BlockTypes WHERE btID = ?", array($blockId));
//            }
//            if(is_object($nextEventblock)) {
//                $blockId = $nextEventblock->getBlockTypeID();
//                //delete of blocktype not in orm way, because there is no entity BlockType
//                $db->query("DELETE FROM BlockTypes WHERE btID = ?", array($blockId));
//            }
            parent::uninstall();
            $em->getConnection()->commit();
        }catch(Exception $e){
            $em->getConnection()->rollBack();
            throw $e;
        }
    }

}