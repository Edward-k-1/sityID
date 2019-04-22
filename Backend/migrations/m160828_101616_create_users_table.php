<?php

use yii\db\Migration;

/**
 * Handles the creation for table `users`.
 */
class m160828_101616_create_users_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%users}}', [
            'id' => $this->primaryKey(),
            'username' => $this->string(),
            'auth_key' => $this->string(32),
            'password_hash' => $this->string(),
            'password_reset_token' => $this->string(),
            'email' => $this->string(),
            'parent_id' => $this->integer()->unsigned(),
            'role' => $this->smallInteger(6)->unsigned(),
            'status' => $this->smallInteger(6)->unsigned(),
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
        $this->dropTable('{{%users}}');
    }
}
