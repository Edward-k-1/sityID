<?php

use yii\db\Migration;

class m170207_122102_create_table_orders_sinc extends Migration
{
    public function up()
    {

        $this->createTable('{{%orders_sync}}', [
                'id' => $this->primaryKey(),
                'orders_id' => $this->integer(),
                "created_at"=>$this->integer()->unsigned(),
                "updated_at"=>$this->integer()->unsigned(),
                'author_id' => $this->integer()->unsigned(),
                'updater_id' => $this->integer()->unsigned(),
            ]
        );

    }

    public function down()
    {
        $this->dropTable('{{%orders_sync}}');

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
