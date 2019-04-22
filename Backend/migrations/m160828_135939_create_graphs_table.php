<?php

use yii\db\Migration;

/**
 * Handles the creation for table `graphs`.
 */
class m160828_135939_create_graphs_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%graphs}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'routes_id' => $this->integer()->unsigned(),
            'carriers_id' => $this->integer()->unsigned(),
            'status' => 'tinyint(2) unsigned DEFAULT NULL',
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('{{%graphs}}');
    }
}
