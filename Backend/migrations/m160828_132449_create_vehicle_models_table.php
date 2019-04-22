<?php

use yii\db\Migration;

/**
 * Handles the creation for table `vehicle_models`.
 */
class m160828_132449_create_vehicle_models_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%vehicle_models}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
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
        $this->dropTable('{{%vehicle_models}}');
    }
}
