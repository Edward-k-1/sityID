<?php

use yii\db\Migration;

/**
 * Handles the creation for table `vehicles_tcd`.
 */
class m161020_062624_create_vehicles_tcd_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%vehicles_tcd}}', [
            'id' => $this->primaryKey(),
            'action_date' => $this->integer(),
            'status' => "tinyint unsigned null",
            'message_id' => $this->integer()->unsigned(),
            'vehicles_id' => $this->integer()->unsigned(),
            'parks_id' => $this->integer()->unsigned(),
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
        $this->dropTable('{{%vehicles_tcd}}');
    }
}
