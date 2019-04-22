<?php

use yii\db\Migration;

class m161020_063716_create_table_workshifts_orders extends Migration
{
    public function up()
    {
        $this->createTable('{{%workshifts_orders}}', [
            'id' => $this->primaryKey(),
            'orders_id' => $this->integer()->unsigned(),
            'workshifts_id' => $this->integer()->unsigned(),
            'flights_plan' => $this->integer()->unsigned(),
            'flights_fact' => $this->integer()->unsigned(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);

    }

    public function down()
    {
        $this->dropTable('{{%workshifts_orders}}');

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
