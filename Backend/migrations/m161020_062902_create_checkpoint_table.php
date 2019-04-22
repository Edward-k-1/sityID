<?php

use yii\db\Migration;

/**
 * Handles the creation for table `chekpoint`.
 */
class m161020_062902_create_chekpoint_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%checkpoint}}', [
            'id' => $this->primaryKey(),
            'workers_id' => $this->integer()->unsigned(),
            'time_arrival' => $this->integer()->unsigned(),
            'time_leave' => $this->integer()->unsigned(),
            'drivers_workshift_id' => $this->integer()->unsigned(),
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
        $this->dropTable('{{%chekpoint}}');
    }
}
