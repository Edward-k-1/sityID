<?php

use yii\db\Migration;

class m170119_121229_create_table_worker_job_time extends Migration
{
    public function up()
    {
        $this->createTable('{{%workers_job_time}}', [
                'id' => $this->primaryKey(),
                "workers_id" => $this->integer(),
                "time" => $this->float(),
                'created_at' => $this->integer()->unsigned(),
                'updated_at' => $this->integer()->unsigned(),
                'author_id' => $this->integer()->unsigned(),
                'updater_id' => $this->integer()->unsigned(),
            ]
        );

    }

    public function down()
    {
        $this->dropTable('{{%workers_job_time}}');
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
