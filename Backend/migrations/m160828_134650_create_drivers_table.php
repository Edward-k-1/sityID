<?php

use yii\db\Migration;

/**
 * Handles the creation for table `drivers`.
 */
class m160828_134650_create_drivers_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%drivers}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'number' => 'tinyint(4) unsigned DEFAULT NULL',
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
        $this->dropTable('{{%drivers}}');
    }
}
