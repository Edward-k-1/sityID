<?php

use yii\db\Migration;

class m170119_121135_create_table_worker_grapth extends Migration
{
    public function up()
    {
        $this->createTable('{{%workers_graphs}}', [
                'id' => $this->primaryKey(),
                "workers_id" => $this->integer(),
                "date" => $this->date(),
                'created_at' => $this->integer()->unsigned(),
                'updated_at' => $this->integer()->unsigned(),
                'author_id' => $this->integer()->unsigned(),
                'updater_id' => $this->integer()->unsigned(),
            ]
        );
    }
    public function down()
    {
        $this->dropTable('{{%workers_graphs}}');
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
