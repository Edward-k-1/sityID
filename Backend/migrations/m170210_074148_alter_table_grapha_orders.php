<?php

use yii\db\Migration;

class m170210_074148_alter_table_grapha_orders extends Migration
{
    public function up()
    {
        $this->addColumn('{{%graphs_orders}}', 'trip0', $this->smallInteger());
        $this->addColumn('{{%graphs_orders}}', 'trip', $this->smallInteger());
        $this->addColumn('{{%graphs_orders}}', 'trip_sp', $this->smallInteger());
        $this->addColumn('{{%graphs_orders}}', 'way0', $this->float());
        $this->addColumn('{{%graphs_orders}}', 'way', $this->float());
        $this->addColumn('{{%graphs_orders}}', 'way_sp', $this->float());
    }

    public function down()
    {
        echo "m170210_074148_alter_table_grapha_orders cannot be reverted.\n";

        return false;
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
