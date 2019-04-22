<?php

use yii\db\Migration;

class m161006_074225_vehicles_content extends Migration
{
    public function up()
    {
        for ($i = 0;$i<50;$i++) {
            $this->insert('{{%vehicle_models}}', [
                'name' => 'name_'.$i,
                'created_at' => time(),
                'updated_at' => time(),
                'author_id'  => rand(0,3),
                'updater_id' => rand(0,3),
                'vehicle_models_types_id' => rand(1,5)
            ]);
        }

        for ($i = 0;$i<1000;$i++) {
            $this->insert('{{%vehicles}}', [
                'state_number' => "AA".(1000+$i)."AA",
                'vehicle_models_id' => rand(1,50),
                'carriers_id' => rand(1,50),
                'parks_id' => rand(1,50),
                'garage_number' => rand(1,50)*10+$i,
                'board_number' => rand(1,9)*100+$i,
                'vehicle_models_views_id' => 1,
                'vehicle_models_types_id' => rand(1,5),
                'updated_at' => time(),
                'author_id'  => rand(0,3),
                'updater_id' => rand(0,3),
            ]);
        }

    }

    public function down()
    {
        echo "m161006_074225_vehicles_content cannot be reverted.\n";

        return false;
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
