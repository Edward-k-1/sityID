<?php

use yii\db\Migration;

class m161012_062709_createMonitoringCompany extends Migration
{
    public function up()
    {
        $this->createTable('{{%monitoring_company}}', [
            'id' => $this->primaryKey(),
            'vehicles_id' => $this->integer()->unsigned(),
            'routes_id' => $this->integer()->unsigned(),
            'graphs_id' => $this->integer()->unsigned(),
            'driver_workers_id' => $this->integer()->unsigned(),
            'arrival' => $this->integer()->unsigned(),
            'departure_plan' => $this->integer()->unsigned(),
            'departure_fact' => $this->integer()->unsigned(),
            'state' => "tinyint unsigned null",
            'conductor_workers_id' => $this->integer()->unsigned(),
            'conductor_status' => "tinyint unsigned null",
            'fuel' => $this->integer(),
            'medical_service' => "tinyint unsigned null",
            'technical_control' => "tinyint unsigned null",
            'gates' => "tinyint unsigned null",
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);
    }

    public function down()
    {
       $this->dropTable('{{%monitoring_company}}');
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
