<?php
/**
 * Migration for inserting initial data after changing db structure.
 *
 * @company: Vizor
 * @author Vitaliy Viznyuk <vitaliyviznyuk@gmail.com>
 * @date 11.09.2016
 * @time 15:47
 */

use yii\db\Migration;

class m160911_124627_insert_init_data_after_change extends Migration
{
    public function up()
    {
        // Inserting into table 'worker_views'

        $this->insert('{{%worker_views}}', [
            'name' => 'Водій',
            'created_at' => time(),
            'updated_at' => time(),
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%worker_views}}', [
            'name' => 'Кондуктор',
            'created_at' => time(),
            'updated_at' => time(),
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        // Inserting into table 'parks'

        $this->insert('{{%parks}}', [
            'name' => 'АТП № 5',
            'created_at' => time(),
            'updated_at' => time(),
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        // Inserting into table 'vehicle_models_views'

        $this->insert('{{%vehicle_models_views}}', [
            'name' => 'Автотранспорт',
            'created_at' => time(),
            'updated_at' => time(),
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        // Inserting into table 'vehicle_models_types'

        $this->insert('{{%vehicle_models_types}}', [
            'name' => 'Автобус',
            'created_at' => time(),
            'updated_at' => time(),
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_models_types}}', [
            'name' => 'Тролейбус',
            'created_at' => time(),
            'updated_at' => time(),
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_models_types}}', [
            'name' => 'Трамвай',
            'created_at' => time(),
            'updated_at' => time(),
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_models_types}}', [
            'name' => 'Швидкісний трамвай',
            'created_at' => time(),
            'updated_at' => time(),
            'author_id' => 1,
            'updater_id' => 1,
        ]);

        $this->insert('{{%vehicle_models_types}}', [
            'name' => 'Електропоїзд',
            'created_at' => time(),
            'updated_at' => time(),
            'author_id' => 1,
            'updater_id' => 1,
        ]);
    }

    public function down()
    {
        echo "m160911_124627_insert_init_data_after_change cannot be reverted.\n";

        return false;
    }
}
