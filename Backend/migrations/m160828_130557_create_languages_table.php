<?php

use yii\db\Migration;

/**
 * Handles the creation for table `languages`.
 */
class m160828_130557_create_languages_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%languages}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'code' => $this->string(2),
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
        $this->dropTable('{{%languages}}');
    }
}
