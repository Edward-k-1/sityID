<?php

use yii\db\Migration;

class m161020_071331_create_table_gates extends Migration
{
    public function up()
    {
        $this->createTable('{{%gates}}', [
        'id' => $this->primaryKey(),
        'vehicles_workshift_id' => $this->integer()->unsigned(),
        'vehicles_id' => $this->integer()->unsigned(),
        'action_time' => $this->integer()->unsigned(),
        'status' => 'tinyint unsigned null',
        'created_at' => $this->integer()->unsigned(),
        'updated_at' => $this->integer()->unsigned(),
        'author_id' => $this->integer()->unsigned(),
        'updater_id' => $this->integer()->unsigned(),
    ]);

    }

    public function down()
    {
       $this->dropTable('{{%gates}}');
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
