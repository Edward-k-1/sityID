<?php

use yii\db\Migration;

/**
 * Handles the creation for table `vehicles`.
 */
class m160828_132642_create_vehicles_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%vehicles}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'number' => 'tinyint(6) unsigned DEFAULT NULL',
            'state_number' => $this->string(10),
            'vehicle_types_id' => $this->integer()->unsigned(),
            'vehicle_models_id' => $this->integer()->unsigned(),
            'carriers_id' => $this->integer()->unsigned(),
            'parks_id' => $this->integer()->unsigned(),
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
        $this->dropTable('{{%vehicles}}');
    }
}
