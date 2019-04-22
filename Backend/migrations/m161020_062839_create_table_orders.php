
<?php

use yii\db\Migration;

class m161020_062839_create_table_orders extends Migration
{
    public function up()
    {
        $this->createTable('{{%orders}}', [
            'id' => $this->primaryKey(),
            'routes_id' => $this->integer()->unsigned(),
            'graphs_id' => $this->integer()->unsigned(),
            'parks_id' => $this->integer()->unsigned(),
            'action_date' => $this->date(),
            'time_to' => $this->integer()->unsigned(),
            'time_from' => $this->integer()->unsigned(),
            'schedules_id' => $this->integer()->unsigned(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);

    }

    public function down()
    {
        $this->dropTable('{{%orders}}');
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

