<?php
/**
 * Created by PhpStorm.
 * User: lucius
 * Date: 07.12.15
 * Time: 22:01
 */

namespace Concrete\Package\BasicTablePackage\Src;

use Concrete\Package\BasicTablePackage\Block\BasicTableBlockPackaged\Src\TableBlockOption;
use Concrete\Package\BasicTablePackage\Src\Entity;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Console\Helper\Table;

/**
 * Class BasicTableInstance
 * @package Concrete\Package\BasicTablePackage\Src
 * @Entity
 * @Table(name="btBasicTableInstance")
 */
class BasicTableInstance extends Entity
{
    /**
     * @var int
     * @Id @Column(type="integer")
     * @GEneratedValue(strategy="AUTO")
     */
    protected $bID;

    /**
     * @OneToMany(targetEntity="Concrete\Package\BasicTablePackage\Src\BlockOptions\TableBlockOption", mappedBy="BasicTableInstance")
     **/
    protected $tableBlockOptions;

    public function __construct()
    {
        $this->tableBlockOptions = new ArrayCollection();
    }
    public function addBlockOption(TableBlockOption $option){
        $this->tableBlockOptions[] = $option;
    }

    public function removeBlockOption(TableBlockOption $option){
        $this->tableBlockOptions->removeElement($option);
    }


}