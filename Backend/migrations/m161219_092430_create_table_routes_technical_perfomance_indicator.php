<?php

use yii\db\Migration;

class m161219_092430_create_table_routes_technical_perfomance_indicator extends Migration
{
    public function up()
    {
        $this->createTable('{{%routes_technical_perfomence_indicator}}', [
            'id' => $this->primaryKey(),
            "release_number"=>$this->smallInteger()->unsigned(),
            "date" => $this->date(),
            'routes_id' =>$this->integer()->unsigned(),
            'parks_id' =>$this->integer()->unsigned(),
            'workshifts_id' =>$this->integer()->unsigned(),
            'workers_id' =>$this->integer()->unsigned(),
            "total_time_float" =>$this->float(),
            "total_time"=>$this->integer()->unsigned(),
            "own_time"=>$this->integer()->unsigned(),
            "zero_time"=>$this->integer()->unsigned(),
            "special_time"=>$this->integer()->unsigned(),
            "total_flight"=>$this->smallInteger()->unsigned(),
            "own_flight"=>$this->smallInteger()->unsigned(),
            "zero_flight"=>$this->smallInteger()->unsigned(),
            "special_flight"=>$this->smallInteger()->unsigned(),
            "total_distance" => $this->float(),
            "own_distance" => $this->float(),
            "zero_distance" => $this->float(),
            "special_distance" => $this->float(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);

    }

    public function down()
    {
        $this->dropTable('{{%routes_technical_perfomence_indicator}}');
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
