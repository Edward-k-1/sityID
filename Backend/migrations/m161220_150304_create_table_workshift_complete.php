<?php

use yii\db\Migration;

class m161220_150304_create_table_workshift_complete extends Migration
{
    public function up()
    {
        $this->createTable('{{%workshift_complete}}', [
                'id' => $this->primaryKey(),
                'workshift_orders_id' =>$this->integer()->unsigned(),
                "drivers_id" => $this->integer(),
                "vehicles_id" => $this->integer(),
                'schedule_time_to'=>$this->integer()->unsigned(),
                'schedule_time_from'=>$this->integer()->unsigned(),
                'fact_time_to'=>$this->integer()->unsigned(),
                'fact_time_from'=>$this->integer()->unsigned(),
                "odometer_start"=>$this->integer()->unsigned(),
                "odometer_end"=>$this->integer()->unsigned(),
                "fuel_cost"=>$this->integer()->unsigned(),
                "fuel_remnant"=>$this->integer()->unsigned(),
                "fuel_transfer"=>$this->integer()->unsigned(),
                "fuel_added"=>$this->integer()->unsigned(),
                "date"=>$this->date(),
            ]
        );
    }

    public function down()
    {
        $this->dropTable('{{%workshift_complete}}');
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
