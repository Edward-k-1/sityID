<?php
/**
 * Migration for creation table 'vehicle_models_views'.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 13:36
 */

use yii\db\Migration;

/**
 * Handles the creation for table `vehicle_models_views`.
 */
class m160911_103546_create_vehicle_models_views_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('{{%vehicle_models_views}}', [
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
        $this->dropTable('{{%vehicle_models_views}}');
    }
}
