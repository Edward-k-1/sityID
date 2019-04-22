<?php

use yii\db\Migration;

class m161214_165009_create_table_routes_length extends Migration
{
    public function up()
    {
        $this->createTable('{{%routes_length}}', [
            'id' => $this->primaryKey(),
            'routes_id' =>$this->integer()->unsigned()->unique(),
            'forward' => $this->float(),
            'backward' => $this->float(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);

    }

    public function down()
    {
        $this->dropTable('routes_length');
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
