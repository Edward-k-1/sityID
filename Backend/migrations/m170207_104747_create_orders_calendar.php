<?php

use yii\db\Migration;

class m170207_104747_create_orders_calendar extends Migration
{
    public function up()
    {

        $this->createTable('{{%orders_calendar}}', [
                'id' => $this->primaryKey(),
                'date' => $this->date(),
                "type" => $this->integer(),
                "created_at"=>$this->integer()->unsigned(),
                "updated_at"=>$this->integer()->unsigned(),
                'author_id' => $this->integer()->unsigned(),
                'updater_id' => $this->integer()->unsigned(),
                "sync_1c_id" => $this->string(15),
            ]
        );
    }

    public function down()
    {
        $this->dropTable('{{%orders_calendar}}');
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
