<?php

use yii\db\Migration;

class m161114_082435_create_table_smart_cart extends Migration
{
    public function up()
    {
        $this->createTable('{{%smart_cards}}', [
            'id' => $this->primaryKey(),
            'workers_id' => $this->integer()->unsigned()->unique(),
            'card_key' => $this->integer()->unsigned(),
            'status' => $this->boolean(),
            'activation_date' => $this->integer()->unsigned(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);
    }

    public function down()
    {
        $this->dropTable('{{%smart_cards}}');
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
