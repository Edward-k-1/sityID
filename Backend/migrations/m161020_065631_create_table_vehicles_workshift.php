<?php

use yii\db\Migration;

class m161020_065631_create_table_vehicles_workshift extends Migration
{
    public function up()
    {
        $this->createTable('{{%vehicles_workshift}}', [
            'id' => $this->primaryKey(),
            'vehicles_tcd_id' => $this->integer()->unsigned(),
            'workshifts_orders_id' => $this->integer()->unsigned(),
            'time_from' => $this->integer()->unsigned(),
            'time_to' => $this->integer()->unsigned(),
            'vehicles_id' => $this->integer()->unsigned(),

            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);

    }

    public function down()
    {
       $this->dropTable('{{%vehicles_workshift}}');
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
