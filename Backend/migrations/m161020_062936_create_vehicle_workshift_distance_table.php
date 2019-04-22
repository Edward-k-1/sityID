<?php

use yii\db\Migration;

/**
 * Handles the creation for table `vehicle_workshift_distance`.
 */
class m161020_062936_create_vehicle_workshift_distance_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%vehicle_workshift_distance}}', [
            'id' => $this->primaryKey(),
            'vehicles_workshift_id' => $this->integer()->unsigned(),
            'distance' => $this->smallInteger()->unsigned(),
            'odometer_start' => $this->integer()->unsigned(),
            'odometer_end' => $this->integer()->unsigned(),
            'vehicles_id' => $this->integer()->unsigned(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('{{%vehicle_workshift_distance}}');
    }
}
