<?php

use yii\db\Migration;

/**
 * Handles the creation for table `vehicle_types_lang`.
 */
class m160828_132238_create_vehicle_types_lang_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%vehicle_types_lang}}', [
            'id' => $this->primaryKey(),
            'vehicle_types_id' => $this->integer()->unsigned(),
            'languages_id' => $this->integer()->unsigned(),
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
        $this->dropTable('{{%vehicle_types_lang}}');
    }
}
