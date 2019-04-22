<?php
/**
 * Migration for changing table 'vehicle_models'.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 13:47
 */

use yii\db\Migration;

class m160911_104634_change_vehicle_models_table extends Migration
{
    public function up()
    {
        $this->addColumn('{{%vehicle_models}}', 'vehicle_models_types_id', $this->integer()->unsigned());
    }

    public function down()
    {
        $this->dropColumn('{{%vehicle_models}}', 'vehicle_models_types_id');
    }
}
