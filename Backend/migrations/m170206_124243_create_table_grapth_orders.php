<?php

use yii\db\Migration;

class m170206_124243_create_table_grapth_orders extends Migration
{
    public function up()
    {
        $this->createTable('{{%graphs_orders}}', [
                'id' => $this->primaryKey(),
                'day_type' => $this->smallInteger(),
                "mar" => $this->string(255),
                "aname" => $this->string(255),
                "bname" => $this->string(255),
                "vip" => $this->smallInteger(),
                'vip_s' => $this->dateTime(),
                'vip_e' => $this->dateTime(),
                "smen" => $this->smallInteger(),
                "smen_type" => $this->string(255),
                "smen_type_id" => $this->integer(),
                "smen_s" => $this->dateTime(),
                "time_s" => $this->dateTime(),
                "point_s" => $this->string(255),
                /*****************************/
                "din1_s" => $this->dateTime(),
                "din1_l" => $this->smallInteger(),
                "din1_pl" => $this->string(255),
                /***************************/
                "din2_s" => $this->dateTime(),
                "din2_l" => $this->smallInteger(),
                "din2_pl" => $this->string(255),
                /*********************************/
                "time_e" => $this->dateTime(),
                "point_e" => $this->string(255),
                "smen_e" => $this->dateTime(),
                "type_pe" => $this->string(255),
                "created_at"=>$this->integer(),
                "updated_at"=>$this->integer(),
            ]
        );
    }

    public function down()
    {
        $this->dropTable('{{%graphs_orders}}');
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
