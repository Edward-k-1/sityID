<?php

use yii\db\Migration;

/**
 * Handles the creation for table `messages`.
 */
class m161020_062820_create_messages_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%messages}}', [
            'id' => $this->primaryKey(),
            'message' => $this->string(),
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
        $this->dropTable('{{%messages}}');
    }
}
