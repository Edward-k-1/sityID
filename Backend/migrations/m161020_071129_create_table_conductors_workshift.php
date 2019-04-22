<?php

use yii\db\Migration;

class m161020_071129_create_table_conductors_workshift extends Migration
{
    public function up()
    {
        $this->createTable('{{%conductors_workshift}}', [
            'id' => $this->primaryKey(),
            'conductors_id' => $this->integer()->unsigned(),
            'status' => "tinyint unsigned null",
            'action_date' => $this->date(),
            'messages_id' => $this->integer()->unsigned(),
            'workshifts_orders_id' => $this->integer()->unsigned(),
            'time_from' => $this->integer()->unsigned(),
            'time_to' => $this->integer()->unsigned(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);

    }

    public function down()
    {
        $this->dropTable('{{%conductors_workshift}}');
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
