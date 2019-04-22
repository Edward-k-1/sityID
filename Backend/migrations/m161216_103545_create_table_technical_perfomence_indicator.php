<?php

use yii\db\Migration;

class m161216_103545_create_table_technical_perfomence_indicator extends Migration
{
    public function up()
    {
        $this->createTable('{{%technical_perfomence_indicator}}', [
            'id' => $this->primaryKey(),
            "date" => $this->date(),
            'routes_id' =>$this->integer()->unsigned(),
            'parks_id' =>$this->integer()->unsigned(),
            'vehicle_models_id' => $this->integer()->unsigned(),
            'vehicle_working_day' => $this->smallInteger(),
            'vehicle_working_day_of' => $this->smallInteger(),
            'vehicle_working_day_all' => $this->smallInteger(),

            'vehicle_working_hour' => $this->float(),
            'vehicle_working_hour_of' => $this->float(),
            'vehicle_working_hour_all' => $this->float(),

            'vehicle_race_self_work' => $this->float(),
            'vehicle_race_self_off' => $this->float(),
            'vehicle_race_self_all' => $this->float(),

            'vehicle_race_zero_work' => $this->float(),
            'vehicle_race_zero_off' => $this->float(),
            'vehicle_race_zero_all' => $this->float(),

            'vehicle_race_summary_work' => $this->float(),
            'vehicle_race_summary_off' => $this->float(),
            'vehicle_race_summary_all' => $this->float(),
            'vehicle_flight_work' => $this->smallInteger(),
            'vehicle_flight_off' => $this->smallInteger(),
            'vehicle_flight_all' => $this->smallInteger(),
            'place_distance' => $this->float(),
            'speed_operational' => $this->float(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);
    }

    public function down()
    {
        $this->dropTable('{{%technical_perfomence_indicator}}');
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
