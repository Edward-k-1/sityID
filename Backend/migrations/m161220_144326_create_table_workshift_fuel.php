<?php

use yii\db\Migration;

class m161220_144326_create_table_workshift_fuel extends Migration
{
    public function up()
    {
        $this->createTable('{{%workshift_fuel}}', [
            'id' => $this->primaryKey(),
             'workshift_orders_id' =>$this->integer()->unsigned(),
             'fuel'=>$this->integer()->unsigned(),
             "vehicles_id"=> $this->integer()->unsigned(),
             "date"=>$this->date(),
        ]
        );

    }

    public function down()
    {
        $this->dropTable('{{%workshift_fuel}}');

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
