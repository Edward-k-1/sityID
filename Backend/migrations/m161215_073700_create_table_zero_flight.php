<?php

use yii\db\Migration;

class m161215_073700_create_table_zero_flight extends Migration
{
    public function up()
    {

        $this->createTable('{{%zero_flight}}', [
            'id' => $this->primaryKey(),
            'routes_id' =>$this->integer()->unsigned(),
            'parks_id' =>$this->integer()->unsigned(),
            'forward' =>  $this->float(),
            'backward' =>  $this->float(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);
    }

    public function down()
    {
        $this->dropTable('{{%zero_flight}}');
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
