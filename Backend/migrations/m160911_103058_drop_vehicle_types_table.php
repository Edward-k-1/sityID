<?php
/**
 * Migration for dropping table 'vehicle_types'.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 13:29
 */

use yii\db\Migration;

/**
 * Handles the dropping for table `vehicle_types`.
 */
class m160911_103058_drop_vehicle_types_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->dropTable('{{%vehicle_types}}');
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->createTable('{{%vehicle_types}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string(),
            'created_at' => $this->integer()->unsigned(),
            'updated_at' => $this->integer()->unsigned(),
            'author_id' => $this->integer()->unsigned(),
            'updater_id' => $this->integer()->unsigned(),
        ]);
    }
}
