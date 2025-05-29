import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import User from './user.model';

// Friend attributes interface
interface FriendAttributes {
  id: number;
  user_id: number;
  friend_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  created_at: Date;
  updated_at: Date;
}

// Friend creation attributes interface
interface FriendCreationAttributes extends Optional<FriendAttributes, 'id' | 'created_at' | 'updated_at'> {}

// Friend model class
class Friend extends Model<FriendAttributes, FriendCreationAttributes> implements FriendAttributes {
  public id!: number;
  public user_id!: number;
  public friend_id!: number;
  public status!: 'pending' | 'accepted' | 'rejected' | 'blocked';
  public created_at!: Date;
  public updated_at!: Date;
}

// Initialize Friend model
Friend.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    friend_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'blocked'),
      allowNull: false,
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Friend',
    tableName: 'friends',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'friend_id'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

// Define associations
Friend.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Friend.belongsTo(User, { foreignKey: 'friend_id', as: 'friend' });

export default Friend;
