<?php

use yii\db\Migration;

/**
 * Handles the creation for table `fuel`.
 */
class m161020_062849_create_fuel_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%fuel}}', [
            'id' => $this->primaryKey(),
            'vehicles_workshift_id' => $this->integer()->unsigned(),
            'vehicles_id' => $this->integer()->unsigned(),
            'added_fuel' => $this->smallInteger()->unsigned(),
            'action_time' => $this->smallInteger()->unsigned(),
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
        $this->dropTable('{{%fuel}}');
    }
}
