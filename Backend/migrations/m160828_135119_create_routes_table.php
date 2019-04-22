<?php

use yii\db\Migration;

/**
 * Handles the creation for table `routes`.
 */
class m160828_135119_create_routes_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%routes}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'vehicle_types_id' => $this->integer()->unsigned(),
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
        $this->dropTable('{{%routes}}');
    }
}
