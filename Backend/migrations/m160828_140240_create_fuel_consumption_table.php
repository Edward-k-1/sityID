<?php

use yii\db\Migration;

/**
 * Handles the creation for table `fuel_consumption`.
 */
class m160828_140240_create_fuel_consumption_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%fuel_consumption}}', [
            'id' => $this->primaryKey(),
            'vehicle_models_id' => $this->integer()->unsigned(),
            'routes_id' => $this->integer()->unsigned(),
            'value' => $this->float(3)->unsigned(),
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
        $this->dropTable('{{%fuel_consumption}}');
    }
}
