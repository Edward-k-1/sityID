<?php
/**
 * Migration for dropping table 'vehicle_types_lang'.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 13:29
 */

use yii\db\Migration;

/**
 * Handles the dropping for table `vehicle_types_lang`.
 */
class m160911_102848_drop_vehicle_types_lang_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->dropTable('{{%vehicle_types_lang}}');
    }

    /**
     * @inheritdoc
     */
    public function down()
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
}
