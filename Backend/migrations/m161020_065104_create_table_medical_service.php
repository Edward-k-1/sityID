<?php

use yii\db\Migration;

class m161020_065104_create_table_medical_service extends Migration
{
    public function up()
    {
        $this->createTable('{{%medical_service}}', [
            'id' => $this->primaryKey(),
            'drivers_workshift_id' => $this->integer()->unsigned(),
            'drivers_id' => $this->integer()->unsigned(),
            'status' => "tinyint unsigned null",
            'action_date' => $this->integer()->unsigned(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);
    }

    public function down()
    {
        $this->dropTable('{{%medical_service}}');

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
