<?php
/**
 * Migration for changing table 'vehicles'.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 15:40
 */

use yii\db\Migration;

class m160911_123327_change_vehicles_table extends Migration
{
    public function up()
    {
        $this->dropColumn('{{%vehicles}}', 'name');
        $this->dropColumn('{{%vehicles}}', 'number');
        $this->dropColumn('{{%vehicles}}', 'vehicle_types_id');
        $this->addColumn('{{%vehicles}}', 'garage_number', $this->smallInteger(4)->unsigned());
        $this->addColumn('{{%vehicles}}', 'board_number', $this->smallInteger(4)->unsigned());
        $this->addColumn('{{%vehicles}}', 'vehicle_models_views_id', $this->integer()->unsigned());
        $this->addColumn('{{%vehicles}}', 'vehicle_models_types_id', $this->integer()->unsigned());
    }

    public function down()
    {
        $this->dropColumn('{{%vehicles}}', 'garage_number');
        $this->dropColumn('{{%vehicles}}', 'board_number');
        $this->dropColumn('{{%vehicles}}', 'vehicle_models_views_id');
        $this->dropColumn('{{%vehicles}}', 'vehicle_models_types_id');
        $this->addColumn('{{%vehicles}}', 'name', $this->string());
        $this->addColumn('{{%vehicles}}', 'number', 'tinyint(6) unsigned DEFAULT NULL');
        $this->addColumn('{{%vehicles}}', 'vehicle_types_id', $this->integer()->unsigned());
    }
}
